import React from "react";

interface StepProps {
  icon: string;
  label?: string;
}

const Step: React.FC<StepProps> = ({ icon, label }) => (
  <div className="flex flex-col items-center relative">
    <div className="bg-[#251D34] rounded-full w-16 h-16 flex items-center justify-center">
      <img src={icon} alt="icon" className="w-8" />
    </div>

    <span className="mt-4 text-white text-xl">{label}</span>
  </div>
);

export default Step;
