import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { UserContext } from "../../contexts/UserContext.jsx";
import { getPlan } from "../../services/planService.js";
import PlanBuilder from "./PlanBuilder.jsx";

const PlanBuilderEdit = () => {
  const { planId } = useParams();
  const { user } = useContext(UserContext);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPlan = async () => {
      setLoading(true);
      setError("");

      try {
        const planData = await getPlan(planId);
        setPlan(planData);
      } catch (err) {
        setError("Could not load this plan for editing.");
      } finally {
        setLoading(false);
      }
    };

    loadPlan();
  }, [planId]);

  if (loading) return <h3>Checking edit permissions...</h3>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;
  if (!plan) return <p>Plan not found.</p>;

  if (!user?.id) {
    return (
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "1rem" }}>
        <h2>Sign in required</h2>
        <p>You must be signed in to edit plans.</p>
        <Link to="/sign-in">Go to Sign In</Link>
      </div>
    );
  }

  const ownerId = typeof plan.user === "object" ? plan.user?.id : plan.user;
  const isOwner = Number(ownerId) === Number(user.id);

  if (!isOwner) {
    return (
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "1rem" }}>
        <h2>You cannot edit this plan</h2>
        <p>Only the owner can edit a plan.</p>
        <p>
          <Link to={`/plans/${planId}`}>Back to Plan Detail</Link>
        </p>
      </div>
    );
  }

  return <PlanBuilder />;
};

export default PlanBuilderEdit;
