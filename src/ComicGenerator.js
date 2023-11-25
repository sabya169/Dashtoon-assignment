import React, { useState } from "react";
import axios from "axios";
import Skeleton from "@mui/material/Skeleton";

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
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const index = parseInt(id.split("_")[0], 10) - 1;

    setComic((prevComic) => ({ ...prevComic, [id]: value }));
    setCurrentInputIndex(index);
  };

  console.log(imageUrls[0]);

  return (
    <>
      <div id="form_container">
        <h1> Comic Creator </h1>
        <form onSubmit={handleSubmit}>
          <div className="grid_container">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="grid_item">
                <input
                  placeholder={`Enter comic ${index + 1}`}
                  id={`${index + 1}_comic`}
                  onChange={handleInputChange}
                  value={comic[`${index + 1}_comic`] || ""}
                  className="text_field"
                />
              </div>
            ))}
          </div>
          <button type="submit" variant="outlined" color="error">
            Submit
          </button>

          <div className="grid_container">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="grid_item">
                {imageUrls[index] && (
                  <div className="image_container">
                    <img src={imageUrls[index]} alt={`Comic ${index + 1}`} />
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
