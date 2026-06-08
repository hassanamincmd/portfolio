export function ProcessSteps({ steps }) {
  if (!steps?.length) return null;

  return (
    <ol className="process-steps">
      {steps.map((step) => (
        <li className="process-step" key={step.step}>
          <span className="process-step__index">{step.step}</span>
          <div>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
