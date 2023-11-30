import React from 'react';

type TabProps = {
  id: string,
  isSelected: boolean;
  select: (id: string) => void,
  label: string,
  children?: React.ReactNode,
};

export default function Tab(props: TabProps) {
  const id = props.id;
  const tabbedId = `${id}-tab`;
  return (
    <section className="tab">
      <input type="radio" name="tab" className="tab-control"
             id={tabbedId} checked={props.isSelected}
             onChange={() => props.select(id)}/>
        <h1 className="tab-title">
          <label htmlFor={tabbedId}>{props.label}</label>
        </h1>
        <div className="tab-content" id={props.id}>
          {props.children}
        </div>
    </section>
  );
}
