
import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import LifeMapFlow from '@/components/LifeMapFlow';
import '@xyflow/react/dist/style.css';

const Index = () => {
  return (
    <div className="h-screen w-screen bg-black">
      <ReactFlowProvider>
        <LifeMapFlow />
      </ReactFlowProvider>
    </div>
  );
};

export default Index;
