export function ToolsList({ tools }) {
  if (!tools?.length) return null;

  return (
    <ul className="tools-list">
      {tools.map((tool) => (
        <li key={tool}>{tool}</li>
      ))}
    </ul>
  );
}
