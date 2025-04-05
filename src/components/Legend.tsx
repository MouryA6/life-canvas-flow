import React from 'react';
import { Square, Circle, Cloud, HelpCircle } from 'lucide-react';

const Legend = () => {
  const shapes = [
    { 
      icon: Circle, 
      name: 'Circle', 
      description: 'Core aspects of life (e.g., Me, Family, Career)' 
    },
    { 
      icon: Square, 
      name: 'Rectangle', 
      description: 'Goals, Projects, or Specific Activities' 
    },
    { 
      icon: Cloud, 
      name: 'Cloud', 
      description: 'Ideas, Dreams, or Future Aspirations' 
    }
  ];

  const colors = [
    { color: '#00FF00', name: 'Green', meaning: 'Personal Growth & Development' },
    { color: '#00FFFF', name: 'Blue', meaning: 'Professional & Career' },
    { color: '#FF00FF', name: 'Pink', meaning: 'Relationships & Social' },
    { color: '#FFFF00', name: 'Yellow', meaning: 'Health & Wellbeing' },
    { color: '#FF0000', name: 'Red', meaning: 'Challenges & Areas of Focus' }
  ];

  return (
    <div className="legend-container">
      <HelpCircle className="legend-icon" />
      <div className="legend-content">
        <div className="flex items-center mb-3">
          <h3 className="font-semibold">Legend</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Shapes</h4>
            <div className="space-y-2">
              {shapes.map((shape) => (
                <div key={shape.name} className="flex items-start gap-2">
                  <shape.icon className="w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium">{shape.name}:</span>
                    <span className="text-sm text-white/70 ml-1">{shape.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Colors</h4>
            <div className="space-y-2">
              {colors.map((color) => (
                <div key={color.name} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full border-2"
                    style={{ borderColor: color.color }}
                  />
                  <div>
                    <span className="font-medium">{color.name}:</span>
                    <span className="text-sm text-white/70 ml-1">{color.meaning}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legend; 