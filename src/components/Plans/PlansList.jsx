import CardList from "../shared/CardList/CardList.jsx";
import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router";
import { getPlans, deletePlan, generateWorkoutsFromPlan } from "../../services/planService";
import { UserContext } from "../../contexts/UserContext";

const PlansList = () => {
  const { user } = useContext(UserContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const scope = searchParams.get("scope") || "user";

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      setError("");
      try {
        const plansData = await getPlans(scope);
        setPlans(plansData);
      } catch (error) {
        setError("Could not load plans.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [scope]);

  const handleAction = async (action, item) => {
    switch (action) {
      case "delete":
        try {
          await deletePlan(item.id);
          setPlans(plans.filter(p => p.id !== item.id));
        } catch (err) {
          setError("Could not delete plan.");
        }
        break;
      case "generate":
        try {
          await generateWorkoutsFromPlan(item.id);
          // Optionally show success message
        } catch (err) {
          setError("Could not generate workouts.");
        }
        break;
    }
  };

  return (
    <CardList
      items={plans}
      itemType="plan"
      cardFields={{
        title: { render: (item) => item.title },
        subtitle: {
          render: (item) => item.user?.username 
            ? `By ${item.user.username}` 
            : "Public plan"
        },
        metadata: {
          render: (item) => `${item.template_links?.length || 0} template${item.template_links?.length === 1 ? '' : 's'}`
        }
      }}
      actions={{
        view: {
          label: "View Details",
          path: (item) => `/plans/${item.id}`,
          alwaysVisible: true
        },
        edit: {
          label: "Edit",
          path: (item) => `/plans/${item.id}/edit`,
          requiresOwnership: true
        },
        delete: {
          label: "Delete",
          action: "delete",
          requiresOwnership: true,
          requiresConfirmation: true,
          confirmationMessage: "Delete this plan? This cannot be undone."
        },
        generateWorkouts: {
          label: "Generate Workouts",
          action: "generate",
          condition: (item) => item.template_links?.length > 0
        }
      }}
      onAction={handleAction}
      detailPath={(item) => `/plans/${item.id}`}
      createPath="/plans/new"
      createLabel="+ New Plan"
      scope={scope}
      onScopeChange={(newScope) => setSearchParams({ scope: newScope })}
      title="Workout Plans"
      loading={loading}
      error={error}
      user={user}
      emptyState={{
        title: "Let's get moving!",
        message: "Create your first workout plan.",
        action: { label: "Create Plan", path: "/plans/new" }
      }}
    />
  );
};

export default PlansList;