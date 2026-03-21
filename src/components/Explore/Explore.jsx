import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getExercises } from "../../services/exerciseService.js";
import { getTemplates } from "../../services/templateService.js";
import { getPlans } from "../../services/planService.js";
import "./Explore.css";

const Explore = () => {
  const [featuredExercises, setFeaturedExercises] = useState([]);
  const [featuredTemplates, setFeaturedTemplates] = useState([]);
  const [featuredPlans, setFeaturedPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExploreData = async () => {
      setLoading(true);
      setError("");
      try {
        const [exercisesData, templatesData, plansData] = await Promise.all([
          getExercises(),
          getTemplates("public"),
          getPlans("public"),
        ]);

        const exercises = Array.isArray(exercisesData) ? exercisesData : [];
        setFeaturedExercises(exercises.slice(0, 3));

        const templates = Array.isArray(templatesData) ? templatesData : [];
        const sortedTemplates = [...templates].sort(
          (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0),
        );
        setFeaturedTemplates(sortedTemplates.slice(0, 3));

        const plans = Array.isArray(plansData) ? plansData : [];
        const publicPlans = plans.filter((p) => p.is_public);
        const sortedPlans = [...publicPlans].sort(
          (a, b) =>
            new Date(b.created_at || b.start_dt || 0) -
            new Date(a.created_at || a.start_dt || 0),
        );
        setFeaturedPlans(sortedPlans.slice(0, 3));
      } catch (err) {
        setError("Could not load Explore content. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchExploreData();
  }, []);

  if (loading)
    return (
      <div className="loading-state">
        <h2>Explore</h2>
        <p>Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="error-state">
        <h2>Explore</h2>
        <p>{error}</p>
      </div>
    );

  const formatDateTime = (value) =>
    value ? new Date(value).toLocaleDateString() : "N/A";

  return (
    <div className="explore-container">
      <header className="explore-header">
        <h2>Explore</h2>
        <p>Jump back into your training or discover new ideas.</p>
      </header>

      <section className="explore-section">
        <header className="section-header">
          <h3>Featured Exercises</h3>
          <Link to="/exercises" className="view-all-link">
            View all exercises
          </Link>
        </header>
        <div className="explore-grid">
          {featuredExercises.map((ex) => (
            <article key={ex.id} className="explore-card">
              <h4>
                <Link to={`/exercises/${ex.id}`}>{ex.name}</Link>
              </h4>
              <p>{ex.description}</p>
              <div className="card-meta">Exercise</div>
            </article>
          ))}
        </div>
      </section>

      <section className="explore-section">
        <header className="section-header">
          <h3>Featured Templates</h3>
          <Link to="/templates?scope=public" className="view-all-link">
            View all templates
          </Link>
        </header>
        <div className="explore-grid">
          {featuredTemplates.map((t) => (
            <article key={t.id} className="explore-card">
              <h4>
                <Link to={`/templates/${t.id}`}>{t.title}</Link>
              </h4>
              <p>{t.description || "No description provided."}</p>
              <div className="card-meta">
                {t.duration ? `${t.duration} MIN` : "TEMPLATE"}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="explore-section">
        <header className="section-header">
          <h3>Featured Plans</h3>
          <Link to="/plans?scope=public" className="view-all-link">
            View all plans
          </Link>
        </header>
        <div className="explore-grid">
          {featuredPlans.map((p) => (
            <article key={p.id} className="explore-card">
              <h4>
                <Link to={`/plans/${p.id}`}>{p.title}</Link>
              </h4>
              <p>Starts: {formatDateTime(p.start_dt)}</p>
              <div className="card-meta">PLAN</div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Explore;
