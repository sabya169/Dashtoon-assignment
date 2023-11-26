import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import Skeleton from "@mui/material/Skeleton";
import CircularProgress from "@mui/material/CircularProgress";
import Box from '@mui/material/Box';

const ComicGenerator = () => {
  const [comic, setComic] = useState({
    first_comic: "",
    second_comic: "",
    third_comic: "",
    forth_comic: "",
    fifth_comic: "",
    sixth_comic: "",
    seventh_comic: "",
    eighth_comic: "",
    ninth_comic: "",
    tenth_comic: "",
  });

  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [currentInputIndex, setCurrentInputIndex] = useState(null);
  const [previousInputs, setPreviousInputs] = useState(Array(10).fill(""));

  const fetchImage = async (data, inputIndex) => {
    try {
      const response = await axios.post(
        "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
        data,
        {
          headers: {
            Accept: "image/png",
            Authorization:
              "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
            "Content-Type": "application/json",
          },
          responseType: "blob",
        }
      );
      const imageUrl = URL.createObjectURL(new Blob([response.data]));

      setImageUrls((prevImageUrls) => ({
        ...prevImageUrls,
        [inputIndex]: imageUrl,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await Promise.all(
        Object.entries(comic).map(async ([key, input]) => {
          const index = parseInt(key.split("_")[0], 10) - 1;

          if (input.trim() !== "" && input !== previousInputs[index]) {
            await fetchImage({ inputs: input }, index);
            setPreviousInputs((prevInputs) => {
              prevInputs[index] = input;
              return [...prevInputs];
            });
          }
        })
      );

      setCurrentInputIndex(null);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const index = parseInt(id.split("_")[0], 10) - 1;

    setComic((prevComic) => ({ ...prevComic, [id]: value }));
    setCurrentInputIndex(index);
  };

  // console.log(imageUrls[0]);

  const speakText = (text) => {
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);

    speechSynthesis.speak(utterance);
  };

  const handleSpeakClick = (value) => {
    console.log("s", value);
    speakText(value);
  };

  return (
    <>
      <div id="form_container">
        <h1 style={{fontSize:"3em" , marginBottom:"5px"}}> Comic Creator </h1>
        <form onSubmit={handleSubmit}>
          <div className="grid_container">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="input_item">
                <input
                  // id="outlined-basic"
                  variant="outlined"
                  placeholder={`Enter comic ${index + 1}`}
                  id={`${index + 1}_comic`}
                  onChange={handleInputChange}
                  value={comic[`${index + 1}_comic`] || ""}
                  className="text_field"
                />
              </div>
            ))}
          </div>
          <Button type="submit" variant="contained" color="error" id="button">
            Submit
          </Button>
          {loading && (
            <Box sx={{ display: "flex" , justifyContent:"center" , margin:"5px"}}>
              <CircularProgress style={{color:"white"}} />
            </Box>
          )}

          <div className="grid_container">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="grid_item">
                {imageUrls[index] && (
                  <div className="image_container">
                    <img
                      src={imageUrls[index]}
                      alt={`Comic ${index + 1}`}
                      className="image"
                    />

                    <div className="comic_text">
                      {Object.entries(comic)
                        .filter(
                          ([key]) =>
                            parseInt(key.split("_")[0], 10) - 1 === index
                        )
                        .map(([key, value]) => (
                          <div className="speak_text">
                            <div
                              key={key}
                              style={{ fontSize: "20px", color: "white" }}
                            >
                              <b>{value.toUpperCase()}</b>
                            </div>
                            <VolumeUpIcon
                              style={{ cursor: "pointer" }}
                              onClick={() => handleSpeakClick(value)}
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </form>
      </div>
    </>
  );
};

export default ComicGenerator;
