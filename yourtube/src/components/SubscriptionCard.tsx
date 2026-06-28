import React from "react";
import { CheckCircle, Crown } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  title: string;
  price: string;
  color: string;
  features: string[];
  recommended?: boolean;
  currentPlan?: boolean;
  onClick: () => void;
}

const SubscriptionCard = ({
  title,
  price,
  color,
  features,
  recommended,
  currentPlan,
  onClick,
}: Props) => {
  return (
    <div
      className={`relative rounded-2xl shadow-xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl border ${color}`}
    >
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <Crown size={16} />
            Most Popular
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold text-center">{title}</h2>

      <h1 className="text-5xl font-extrabold text-center mt-5">
        ₹{price}
      </h1>

      <p className="text-center text-gray-500 mb-6">per month</p>

      <div className="space-y-3">
        {features.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <CheckCircle className="text-green-500" size={18} />
            <span>{item}</span>
          </div>
        ))}
      </div>

      <Button
        onClick={onClick}
        className="w-full mt-8"
        disabled={currentPlan}
      >
        {currentPlan ? "Current Plan" : `Choose ${title}`}
      </Button>
    </div>
  );
};

export default SubscriptionCard;