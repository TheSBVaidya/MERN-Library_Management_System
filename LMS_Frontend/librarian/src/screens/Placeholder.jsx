const Placeholder = ({ title }) => (
  <>
    <h1 className="h2 mb-4">{title}</h1>
    <div className="card shadow-sm">
      <div className="card-body">
        <p className="text-muted">
          This section is under construction. Functionality for '{title}' will
          be implemented here.
        </p>
      </div>
    </div>
  </>
);

export default Placeholder;
