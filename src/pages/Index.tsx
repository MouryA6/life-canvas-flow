
import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import LifeMapFlow from '@/components/LifeMapFlow';
import '@xyflow/react/dist/style.css';
import { Toaster } from 'sonner';

const Index = () => {
  return (
    <div className="h-screen w-screen bg-black">
      <ReactFlowProvider>
        <LifeMapFlow />
      </ReactFlowProvider>
      <Toaster position="top-right" />
    </div>
  );
};

export default Index;
