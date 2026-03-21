// In PlanFormTest.jsx, replace the entire file with this:
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { UserContext } from "../../contexts/UserContext.jsx";
import { getTemplates } from "../../services/templateService.js";
import { getPlan, createPlan, updatePlan } from "../../services/planService.js";
import PlanForm from "../shared/PlanForm/PlanForm.jsx";

const PlanFormTest = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const isEditMode = Boolean(planId);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const templateData = await getTemplates();
        setTemplates(Array.isArray(templateData) ? templateData : []);
      } catch (err) {
        console.error("Error loading templates:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  const handleLoadPlan = async (planId) => {
    const planData = await getPlan(planId);
    return planData;
  };

  const handleSubmit = async (data, planId) => {
    const savedPlan = isEditMode
      ? await updatePlan(planId, data)
      : await createPlan(data);
    navigate(`/plans/${savedPlan.id}`);
  };

  const handleCancel = () => {
    if (isEditMode) {
      navigate(`/plans/${planId}`);
    } else {
      navigate("/plans");
    }
  };

  if (loading) {
    return <h3>Loading templates...</h3>;
  }

  return (
    <PlanForm
      planId={planId}
      isEditMode={isEditMode}
      loadPlan={handleLoadPlan}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      templates={templates}
      user={user}
    />
  );
};

export default PlanFormTest;