import "./style.css";
import { add, HelloWorld } from "lib";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    ${HelloWorld()}
    ${add(1, 2)}
  </div>
`;
