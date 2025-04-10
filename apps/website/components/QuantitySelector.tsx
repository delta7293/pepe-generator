interface Props {
  countBy?: number;
  max?: number;
  min?: number;
  onChange: (newValue: number) => void;
  value: number;
}

export default function QuantitySelector({
  countBy = 1,
  max = 100,
  min = 1,
  onChange,
  value,
}: Props) {
  const minCalc = Math.max(min, countBy);

  return (
    <div style={{ alignItems: 'center', display: 'flex', gap: 20, justifyContent: 'center' }}>
      <button
        onClick={() => {
          const newValue = value <= minCalc ? max : value - countBy;
          onChange(newValue);
        }}
        style={{
          alignItems: 'center',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          padding: 0,
          margin: 0,
        }}
      >
        <img height={24} src="/images/downarrow.png" />
      </button>
      <input
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          border: 'none',
          borderBottom: '1px #000 solid',
          fontSize: '2em',
          textAlign: 'center',
          width: 100,
        }}
        value={value}
      />
      <button
        onClick={() => {
          const newValue = value >= max ? minCalc : value + countBy;
          onChange(newValue);
        }}
        style={{
          alignItems: 'center',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          padding: 0,
          margin: 0,
        }}
      >
        <img height={24} src="/images/uparrow.png" />
      </button>
    </div>
  );
}
