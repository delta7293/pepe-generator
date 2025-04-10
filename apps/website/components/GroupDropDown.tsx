import { useState } from 'react';
import Clickable from './Clickable';

interface Props {
  groups?: Array<{
    name: string;
    label: string;
    items: Array<{
      image: string;
      label: string;
      note: string;
      value: string;
    }>;
  }>;
  onChange?: (value: string) => void;
  value?: string;
}

export default function GroupDropDown({ groups = [], onChange = () => {}, value = '' }: Props) {
  const [show, setShow] = useState(false);

  const [type, id] = value.split('-');

  const selectedGroup = groups.find((item) => item.name === type);
  const selectedItem = selectedGroup?.items.find((item) => item.value === value);

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
              <div style={{ background: 'gray', height: 60, width: 60 }} />
              <div style={{ flexGrow: 1, fontSize: '1.5em', textAlign: 'left' }}>
                Select Edition
              </div>
              <div style={{ paddingRight: 20 }}>
                {!show && <img height={16} src="/images/downarrow.png" />}
                {show && <img height={16} src="/images/uparrow.png" />}
              </div>
            </>
          )}
          {selectedItem && (
            <>
              <img height={60} src={selectedItem?.image} width={60} />
              <div style={{ flexGrow: 1, textAlign: 'left' }}>
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
              zIndex: 100,
            }}
          >
            {groups.map((group) => (
              <li key={group.name} style={{ margin: 0, padding: 0 }}>
                <div
                  style={{
                    background: 'black',
                    color: 'white',
                    fontSize: '.75em',
                    padding: 5,
                    position: 'sticky',
                    textTransform: 'uppercase',
                    top: 0,
                  }}
                >
                  {group.label}
                </div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {group.items.map((item) => (
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
                        <img height={60} src={item.image} width={60} />
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontSize: '1.5em' }}>{item.label}</div>
                          <div>{item.note}</div>
                        </div>
                      </Clickable>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
