
import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import LifeMapFlow from '@/components/LifeMapFlow';

const Index = () => {
  return (
    <div className="h-screen w-screen">
      <ReactFlowProvider>
        <LifeMapFlow />
      </ReactFlowProvider>
    </div>
  );
};

export default Index;
