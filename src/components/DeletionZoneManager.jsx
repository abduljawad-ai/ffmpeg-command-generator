import DeletionZoneCard from './DeletionZoneCard.jsx';

export default function DeletionZoneManager({ zones, errors, onAdd, onUpdate, onRemove }) {
  return (
    <div className="card">
      <div className="row-between" style={{ marginBottom: '20px' }}>
        <div className="card-title" style={{ marginBottom: 0 }}>
          <span className="card-title-icon">✂</span>
          Deletion Zones
          {zones.length > 0 && (
            <span style={{
              background: 'var(--delete-bg)', color: 'var(--delete-color)',
              borderRadius: '99px', padding: '1px 8px', fontSize: '11px', fontWeight: 600
            }}>{zones.length}</span>
          )}
        </div>
        <button id="add-zone-btn" className="btn btn-secondary btn-sm" onClick={onAdd}>
          + Add Zone
        </button>
      </div>

      {zones.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✂</div>
          <p>No deletion zones yet.</p>
          <p style={{ fontSize: '12px', marginTop: '4px' }}>
            Click <strong>Add Zone</strong> to mark a section you want to cut out.
          </p>
        </div>
      ) : (
        <div className="zone-list">
          {zones.map((zone, i) => (
            <DeletionZoneCard
              key={zone.id}
              zone={zone}
              index={i}
              error={errors[zone.id] || null}
              onUpdate={onUpdate}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
