export function CaseData({ client, year, role, services }) {
  const items = [
    { label: "client", value: client },
    { label: "year", value: year },
    { label: "role", value: role },
    { label: "services", value: Array.isArray(services) ? services.join(", ") : services }
  ];

  return (
    <dl className="case-data">
      {items.map((item) => (
        <div className="case-data__item" key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
