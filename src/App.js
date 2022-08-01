import "./App.css";

import { useRef } from "react";
import styled from "styled-components";

import { drawWrappedText } from "./Canvas.js";

const DIMENSION = 3000;

const DEFAULT_PADDING = 300;
const DEFAULT_LINE_SPACING = 100;
const DEFAULT_PARAGRAPH_SPACING = 300;
const DEFAULT_TEXT = "The quick brown fox jumps over the lazy dog";

const BLUE = "#0b1741";
const WHITE = "#FFFFFF";
const GREEN = "#5AAB93";

const DEFAULT_BGCOLOR = BLUE;
const DEFAULT_MAINCOLOR = WHITE;
const DEFAULT_SUBCOLOR = GREEN;

export default function App() {
  const canvasRef = useRef();

  const draw = () => {
    const context = canvasRef.current.getContext("2d");

    // Paint background color
    context.fillStyle =
      document.getElementById("bgcolor-input").value || DEFAULT_BGCOLOR;
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Paint main text
    context.fillStyle =
      document.getElementById("mtcolor-input").value || DEFAULT_MAINCOLOR;
    context.font = "300px Lato Black";
    context.textBaseline = "top";
    context.textAlign = "left";

    const mainText = document.getElementById("mt-input").value || DEFAULT_TEXT;
    const mainTextOffset = drawWrappedText(
      context,
      0,
      0,
      mainText,
      DEFAULT_PADDING,
      DEFAULT_LINE_SPACING
    );

    context.fillStyle =
      document.getElementById("stcolor-input").value || DEFAULT_SUBCOLOR;
    context.font = "150px Lato Regular";
    context.textBaseline = "top";
    context.textAlign = "left";

    const subText = document.getElementById("st-input").value || DEFAULT_TEXT;
    drawWrappedText(
      context,
      0,
      mainTextOffset + DEFAULT_PARAGRAPH_SPACING,
      subText,
      DEFAULT_PADDING,
      DEFAULT_LINE_SPACING
    );
  };

  const save = async (e) => {
    console.log("Saving...");
    const imageURL = canvasRef.current.toDataURL("image/png", 1.0);
    e.target.href = imageURL;
  };

  return (
    <StyledMain>
      <StyledAside>
        <h3>Content</h3>
        <InputGroupDiv>
          <label htmlFor="mt-input">Main Text Content</label>
          <input id="mt-input" type="text" onChange={draw} />
          <label htmlFor="st-input">Sub Text Content</label>
          <input id="st-input" type="text" onChange={draw} />
        </InputGroupDiv>

        <h3>Coloring</h3>
        <label htmlFor="mtcolor-input">
          Main Text Color in Hex (e.g. #FFFFFF)
        </label>
        <input id="mtcolor-input" type="text" onChange={draw} />
        <InputGroupDiv>
          <label htmlFor="stcolor-input">
            Sub Text Color in Hex (e.g. #5AAB93)
          </label>
          <input id="stcolor-input" type="text" onChange={draw} />
        </InputGroupDiv>
        <InputGroupDiv>
          <label htmlFor="bgcolor-input">
            Background Color in Hex (e.g. #0B1741)
          </label>
          <input id="bgcolor-input" type="text" onChange={draw} />
        </InputGroupDiv>

        <a download="render.png" href="/" onClick={save}>
          Download Image
        </a>
      </StyledAside>
      <canvas
        id="canvas"
        ref={canvasRef}
        width={DIMENSION}
        height={DIMENSION}
      ></canvas>
    </StyledMain>
  );
}

const StyledMain = styled.main`
  display: flex;
  flex-direction: column;
`;

const StyledAside = styled.aside`
  background-color: black;
  color: white;
  padding: 1em;
  line-height: 2em;

  h3 {
    font-size: 2em;
  }

  input[type="text"] {
    width: 100%;
    font-size: 2em;
  }

  a {
    box-sizing: border-box;
    text-align: center;
    padding: 1em;
    text-decoration: none;
    margin: 2em 0;
    display: block;
    background-color: ${GREEN};
    color: ${WHITE};

    &:hover {
      background-color: black;
      border: 1px solid ${GREEN};
      color: ${GREEN};
    }
  }
`;

const InputGroupDiv = styled.div`
  margin: 1em 0;
  display: flex;
  flex-direction: column;
`;
