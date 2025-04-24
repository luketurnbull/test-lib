import "./style.css";
import { HelloWorld } from "lib";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    ${HelloWorld()}
  </div>
`;
