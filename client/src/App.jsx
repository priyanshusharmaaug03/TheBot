import React, { useContext, useRef, useEffect, useState } from "react";
import { Button, TextField, Container, Grid } from "@mui/material";
import { ColorModeContext } from "../src/context/ThemeContext";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import SendIcon from "@mui/icons-material/Send";
import "../src/index.css";
import AIANSWERS from "./loader";
import USERQUESTIONS from "./userqueestions";
function App() {
  const bottomRef = useRef(null);
  const ctx = useContext(ColorModeContext);
  const [answer, setAnswer] = useState(false);
  const [userText, setUserText] = useState("");
  const [convo, setconvo] = useState([]);
  const [loading, setloading] = useState(false);
  const [newvalue, setnewVlue] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setloading(true);

    setconvo([...convo, userText]);

    const response = await fetch("https://thebot.up.railway.app/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: userText,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      const parseData = data.bot;
      setnewVlue(parseData);
      setAnswer(true);
    } else {
      const err = await response.text();
      alert(err);
    }

    clear();
  };

  {
    answer &&
      (setconvo([...convo, newvalue]), setAnswer(false), setloading(false));
  }

  // console.log(convo);
  const clear = () => {
    setUserText("");
  };
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [loading]);

  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          right: "2%",
          top: "2%",
          cursor: "pointer",
          position: "fixed",
        }}
        onClick={ctx.toggleColorMode}
      >
        {ctx.mode === "dark" ? (
          <DarkModeIcon sx={{ ml: 1, fill: "#6750ac" }} />
        ) : (
          <WbSunnyIcon sx={{ ml: 1, fill: "#6750ac" }} />
        )}
      </div>

      <Grid container alignContent="center" justifyContent="center" pb="10vh">
        <Grid item mt="10vh" md={8} xs={12}>
          {convo.map((c, key) => (
            <USERQUESTIONS key={key} question={c} val={key} />
          ))}
          {loading && <AIANSWERS loading={loading} />}
          <div ref={bottomRef} />
        </Grid>
      </Grid>
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            position: "fixed",
            bottom: "0",
            display: "flex",
            width: "100vw",
            padding: "1vh 4vw",
            // backgroundColor: "rgb(57, 57, 57, 60%)",
            backdropFilter: "blur(15px)",
          }}
        >
          <TextField
            name="Question"
            variant="outlined"
            label="Ask to the BOT..."
            value={userText}
            onChange={(e) => {
              setUserText(e.target.value);
            }}
            fullWidth
            disabled={loading === true}
            autoComplete="off"
            sx={{
              "& fieldset": {
                border: "2px solid #6750AC",
              },
            }}
          />

          <Button
            type="submit"
            sx={{
              background: "#5E41B5",
              color: "white",
              display: "flex",
              alignItems: "center",
            }}
            variant="contained"
          >
            {<SendIcon />}
          </Button>
        </form>
        {/* {console.log(convo)} */}
      </Container>
    </div>
  );
}

export default App;
