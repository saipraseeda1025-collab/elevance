import { useEffect, useState } from "react";
import SubscriptionCard from "@/components/SubscriptionCard";
import axiosInstance from "@/lib/axiosinstance";
import { toast } from "sonner";

export default function SubscriptionPage() {
  const [user, setUser] = useState<any>(null);
  const [currentPlan, setCurrentPlan] = useState("Free");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      setUser(storedUser);

      if (storedUser.subscriptionPlan) {
        setCurrentPlan(storedUser.subscriptionPlan);
      }
    }
  }, []);

  const plans = [
    {
      title: "Free",
      price: "0",
      color: "border-gray-300 bg-white",
      features: [
        "10 Downloads",
        "720p Streaming",
        "Advertisements",
        "Basic Support",
      ],
    },
    {
      title: "Bronze",
      price: "99",
      color: "border-orange-400 bg-orange-50",
      features: [
        "30 Downloads",
        "1080p Streaming",
        "No Ads",
        "Priority Support",
      ],
    },
    {
      title: "Silver",
      price: "199",
      color: "border-gray-400 bg-gray-100",
      recommended: true,
      features: [
        "60 Downloads",
        "2K Streaming",
        "Offline Mode",
        "Priority Support",
      ],
    },
    {
      title: "Gold",
      price: "499",
      color: "border-yellow-400 bg-yellow-50",
      features: [
        "Unlimited Downloads",
        "4K Streaming",
        "Offline Mode",
        "Premium Support",
      ],
    },
  ];

  const changePlan = async (plan: any) => {
  if (!user || !user._id) {
    toast.error("Please login first");
    return;
  }

  try {
    setLoading(true);

    const order = await axiosInstance.post(
      "/subscription/create-order",
      {
        amount: Number(plan.price),
      }
    );

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

      amount: order.data.amount,

      currency: order.data.currency,

      name: "YourTube Premium",

      description: `${plan.title} Subscription`,

      order_id: order.data.id,

      handler: async function (response: any) {
        const verify = await axiosInstance.post(
          "/subscription/verify-payment",
          {
            ...response,
            userId: user._id,
            plan: plan.title,
          }
        );

        if (verify.data.success) {
          const updatedUser = verify.data.user;

          localStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
          );

          setUser(updatedUser);

          setCurrentPlan(updatedUser.subscriptionPlan);

          toast.success("Payment Successful 🎉");
        }
      },

      theme: {
        color: "#ff0000",
      },
    };

    const razor = new (window as any).Razorpay(options);

    razor.open();

  } catch (error) {
    console.log(error);

    toast.error("Payment failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 p-10">
      <h1 className="text-5xl font-bold text-center mb-3">
        Choose Your Plan
      </h1>

      <p className="text-center text-gray-600 mb-10">
        Upgrade to unlock premium YouTube features.
      </p>

      {loading && (
        <div className="text-center mb-6 text-red-600 font-semibold">
          Updating your subscription...
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {plans.map((plan) => (
          <SubscriptionCard
            key={plan.title}
            title={plan.title}
            price={plan.price}
            color={plan.color}
            features={plan.features}
            recommended={plan.recommended}
            currentPlan={currentPlan === plan.title}
            onClick={() => changePlan(plan)}
          />
        ))}
      </div>
    </main>
  );
}