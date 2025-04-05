import { Node, Position } from '@xyflow/react';

interface Point {
  x: number;
  y: number;
}

interface NodeDimensions {
  width: number;
  height: number;
}

// Calculate the nearest point on a rectangle's perimeter
function getNearestPointOnRectangle(
  source: Point,
  target: Point,
  targetDimensions: NodeDimensions
): Point {
  const { width, height } = targetDimensions;
  const targetCenter = {
    x: target.x + width / 2,
    y: target.y + height / 2
  };

  // Vector from target center to source
  const dx = source.x - targetCenter.x;
  const dy = source.y - targetCenter.y;

  // Calculate intersection with rectangle
  const angle = Math.atan2(dy, dx);
  const tan = Math.tan(angle);

  let x, y;
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  if (Math.abs(dx) * height > Math.abs(dy) * width) {
    // Intersect with vertical edge
    x = dx > 0 ? target.x + width : target.x;
    y = targetCenter.y + tan * (x - targetCenter.x);
  } else {
    // Intersect with horizontal edge
    y = dy > 0 ? target.y + height : target.y;
    x = targetCenter.x + (y - targetCenter.y) / tan;
  }

  return { x, y };
}

// Calculate the nearest point on a circle's perimeter
function getNearestPointOnCircle(
  source: Point,
  target: Point,
  radius: number
): Point {
  const centerX = target.x + radius;
  const centerY = target.y + radius;
  
  // Vector from center to source
  const dx = source.x - centerX;
  const dy = source.y - centerY;
  
  // Normalize the vector and multiply by radius
  const length = Math.sqrt(dx * dx + dy * dy);
  const unitX = dx / length;
  const unitY = dy / length;
  
  return {
    x: centerX + radius * unitX,
    y: centerY + radius * unitY
  };
}

// Calculate the nearest point on a cloud's perimeter
function getNearestPointOnCloud(
  source: Point,
  target: Point,
  targetDimensions: NodeDimensions
): Point {
  const { width, height } = targetDimensions;
  const centerX = target.x + width / 2;
  const centerY = target.y + height / 2;

  // Calculate angle between source and target center
  const angle = Math.atan2(source.y - centerY, source.x - centerX);
  
  // Cloud shape is approximated as an ellipse
  const radiusX = width * 0.4;
  const radiusY = height * 0.4;
  
  return {
    x: centerX + radiusX * Math.cos(angle),
    y: centerY + radiusY * Math.sin(angle)
  };
}

// Get node dimensions based on type
function getNodeDimensions(node: Node): NodeDimensions {
  const defaultSize = { width: 100, height: 100 };
  
  if (!node.style) return defaultSize;
  
  return {
    width: (node.style.width as number) || defaultSize.width,
    height: (node.style.height as number) || defaultSize.height
  };
}

// Main function to get connection points
export function getConnectionPoints(sourceNode: Node, targetNode: Node): {
  source: Point;
  target: Point;
  sourcePosition: Position;
  targetPosition: Position;
} {
  const sourceDimensions = getNodeDimensions(sourceNode);
  const targetDimensions = getNodeDimensions(targetNode);

  // Calculate absolute center positions
  const sourceCenter = {
    x: sourceNode.position.x + sourceDimensions.width / 2,
    y: sourceNode.position.y + sourceDimensions.height / 2
  };

  const targetCenter = {
    x: targetNode.position.x + targetDimensions.width / 2,
    y: targetNode.position.y + targetDimensions.height / 2
  };

  let sourcePoint: Point;
  let targetPoint: Point;

  // Calculate connection points based on node types
  switch (sourceNode.type) {
    case 'circle':
      sourcePoint = getNearestPointOnCircle(
        targetCenter,
        sourceNode.position,
        sourceDimensions.width / 2
      );
      break;
    case 'cloud':
      sourcePoint = getNearestPointOnCloud(
        targetCenter,
        sourceNode.position,
        sourceDimensions
      );
      break;
    default: // rectangle
      sourcePoint = getNearestPointOnRectangle(
        targetCenter,
        sourceNode.position,
        sourceDimensions
      );
  }

  switch (targetNode.type) {
    case 'circle':
      targetPoint = getNearestPointOnCircle(
        sourceCenter,
        targetNode.position,
        targetDimensions.width / 2
      );
      break;
    case 'cloud':
      targetPoint = getNearestPointOnCloud(
        sourceCenter,
        targetNode.position,
        targetDimensions
      );
      break;
    default: // rectangle
      targetPoint = getNearestPointOnRectangle(
        sourceCenter,
        targetNode.position,
        targetDimensions
      );
  }

  // Calculate angle between connection points
  const dx = targetPoint.x - sourcePoint.x;
  const dy = targetPoint.y - sourcePoint.y;
  const angle = Math.atan2(dy, dx);

  // Determine optimal handle positions
  const sourcePosition = getHandlePosition(angle);
  const targetPosition = getHandlePosition(angle + Math.PI);

  return {
    source: sourcePoint,
    target: targetPoint,
    sourcePosition,
    targetPosition
  };
}

// Helper function to determine handle position based on angle
function getHandlePosition(angle: number): Position {
  // Convert angle to degrees and normalize to 0-360
  const degrees = ((angle * 180 / Math.PI) + 360) % 360;
  
  // Right: -45 to 45 degrees
  if (degrees >= 315 || degrees < 45) return Position.Right;
  // Bottom: 45 to 135 degrees
  if (degrees >= 45 && degrees < 135) return Position.Bottom;
  // Left: 135 to 225 degrees
  if (degrees >= 135 && degrees < 225) return Position.Left;
  // Top: 225 to 315 degrees
  return Position.Top;
} 