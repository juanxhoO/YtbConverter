import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import Button from '@mui/material/Button';
import { FormControl, TextField } from '@mui/material';
import { DotLoader } from 'react-spinners';
//import { css } from '@emotion/core';
function App() {

    const [urlVal, setUrl] = useState(0);
    const [showdl, setShowdl] = useState(false);
    const [loading, loadingState] = useState(false);
    const [audioUrl, setAudioUrl] = useState("");
    const [urlDefault, seturldefault] = useState();

    function refreshPage() {
        window.location.reload(false);
    }


    function submitFormHandler(event) {
        event.preventDefault();
        let regex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/ig
        let url_value = urlVal.urlVal;

        if (regex.test(url_value)) {
            loadingState(true);
            axios.get('http://192.168.100.32:9008/audio?url_video=' + url_value + '')
                .then(function (response) {
                    // handle success
                    loadingState(false);
                    setAudioUrl("http://192.168.100.32:9008/download/" + response.data);
                    setShowdl(true);
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                    loadingState(false);
                })
        }
        else {
            console.log("url is not valid")
            alert("URL Is not Valid, enter a complete youtube url");
        }

    }
    return (
        <div className="App">
            <header className="App-header">
                <h1>
                    You Tube Video to Mp3 Converter
                </h1>

                <p>Insert the URL of the you tube vieo and click "Convert Video"</p>
            </header>
            <div>
                <FormControl>
                    <form onSubmit={submitFormHandler}>
                        <TextField
                            id="video-url-input"
                            label="Insert Url: "
                            className="urlField"
                            type="text"
                            name="url"
                            value={urlDefault}
                            margin="normal"
                            variant="outlined"
                        />
                        <DotLoader className='loader'
                            sizeUnit={"px"}
                            size={125}
                            color={'#123abc'}
                            loading={loading}></DotLoader>

                        <Button className={!showdl ? "show  convert_video_btn" : "hidden"} onClick={() => setUrl({ urlVal: document.getElementById('video-url-input').value })} type="submit" variant="contained" color="primary">
                            Convert Video
                        </Button>

                        <Button className={showdl ? "show btnDownload" : "hidden"} onClick={refreshPage} variant="contained" color="primary">
                            Convert Another Video
                        </Button>

                        <Button className={showdl ? "show btnDownload" : "hidden"} href={audioUrl} variant="contained" color="primary">
                            Download Mp3 Audio
                        </Button>
                    </form>

                </FormControl>

            </div>

        </div>
    );
}

export default App;
