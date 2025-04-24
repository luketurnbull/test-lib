import "./style.css";
import { add, HelloWorld, subtract } from "lib";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    ${HelloWorld()}
    ${add(1, 2)}
    ${subtract(4, 5)}
  </div>
`;
