import React from 'react';

export interface EquationErrorProps {
  error: string;
}

const EquationError: React.FC<EquationErrorProps> = ({ error }) => {
  return (
    <div
      style={{
        color: 'rgba(235, 87, 87, 0.8)',
        fontSize: '12px',
        padding: '8px 10px',
        boxShadow: 'rgba(55, 53, 47, 0.06) 0px -1px',
      }}
    >
      <span style={{ fontWeight: 600 }}>Invalid equation:</span> {error}
    </div>
  );
};

export default EquationError;
