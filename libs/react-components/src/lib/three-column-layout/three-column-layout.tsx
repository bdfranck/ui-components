import React, { ReactNode } from "react";

interface WCProps {
  leftcolumnwidth?: string;
  maxcontentwidth?: string;
  rightcolumnwidth?: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "goa-three-column-layout": WCProps & React.HTMLAttributes<HTMLElement>;
    }
  }
}

interface Props {
  leftColumnWidth?: string;
  rightColumnWidth?: string;
  maxContentWidth?: string;
  header: ReactNode;
  footer: ReactNode;
  nav: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
}

export function GoAThreeColumnLayout(props: Props) {
  return (
    <goa-three-column-layout
      leftcolumnwidth={props.leftColumnWidth}
      rightcolumnwidth={props.rightColumnWidth}
      maxcontentwidth={props.maxContentWidth}
    >
      {props.header && <div slot="header">{props.header}</div>}
      {props.nav && <div slot="nav">{props.nav}</div>}
      {props.sidebar && <div slot="sidebar">{props.sidebar}</div>}
      {props.children}
      {props.footer && <div slot="footer">{props.footer}</div>}
    </goa-three-column-layout>
  );
}

export default GoAThreeColumnLayout;