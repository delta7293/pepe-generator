import { useState } from 'react';
import Clickable from './Clickable';

interface Props {
  items: Array<{
    image?: string;
    label: string;
    note?: string;
    value: string;
  }>;
  onChange?: (value: string) => void;
  placeholder?: string;
  value?: string;
}

export default function DropDown({
  items = [],
  onChange = () => {},
  placeholder = '',
  value = '',
}: Props) {
  const [show, setShow] = useState(false);

  const selectedItem = items.find((item) => item.value === value);

  return (
    <>
      <div
        style={{
          margin: 0,
          padding: 0,
          position: 'relative',
        }}
      >
        <Clickable
          onClick={() => setShow(!show)}
          style={{
            alignItems: 'center',
            border: '1px #000 solid',
            display: 'flex',
            gap: 10,
          }}
        >
          {!selectedItem && (
            <>
              <div style={{ flexGrow: 1, fontSize: '1.5em', paddingLeft: 10, textAlign: 'left' }}>
                {placeholder}
              </div>
              <div style={{ paddingRight: 20 }}>
                {!show && <img height={16} src="/images/downarrow.png" />}
                {show && <img height={16} src="/images/uparrow.png" />}
              </div>
            </>
          )}
          {selectedItem && (
            <>
              <div style={{ flexGrow: 1, paddingLeft: 10, textAlign: 'left' }}>
                <div style={{ fontSize: '1.5em' }}>{selectedItem?.label}</div>
                <div>{selectedItem?.note}</div>
              </div>
              <div style={{ paddingRight: 20 }}>
                {!show && <img height={16} src="/images/downarrow.png" />}
                {show && <img height={16} src="/images/uparrow.png" />}
              </div>
            </>
          )}
        </Clickable>
        {show && (
          <ul
            style={{
              border: '1px #000 solid',
              borderTop: 'none',
              display: 'flex',
              flexDirection: 'column',
              listStyle: 'none',
              margin: 0,
              maxHeight: 200,
              overflow: 'scroll',
              padding: 0,
              position: 'absolute',
              left: 0,
              right: 0,
            }}
          >
            {items.map((item) => (
              <li
                key={item.value}
                style={{
                  margin: 0,
                  padding: 0,
                }}
              >
                <Clickable
                  onClick={() => {
                    onChange(item.value);
                    setShow(false);
                  }}
                  style={{
                    alignItems: 'center',
                    backgroundColor: item.value === value ? 'darkred' : 'white',
                    color: item.value === value ? 'white' : 'black',
                    display: 'flex',
                    gap: 10,
                  }}
                >
                  <div style={{ paddingLeft: 10, textAlign: 'left' }}>
                    <div style={{ fontSize: '1.5em' }}>{item.label}</div>
                    <div>{item.note}</div>
                  </div>
                </Clickable>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
