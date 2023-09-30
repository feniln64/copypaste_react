import React, { useState } from 'react'
// import "../assets/home.css"
import CryptoJS from 'crypto-js';
import { useEffect } from 'react';
import axiosInstance from '../api/api'
import psl from 'psl';
import 'bootstrap/dist/css/bootstrap.min.css'

function Test() {
    const [encryptdata, setEncrptedData] = React.useState(``);
    const secretPass = "XkhZG4fW2t2W";
 
    const data = ` <div class="container">  <div class="row">    <div class="col-md-6">        <div class="card">        sldcm        </div>        </div>        <div class="col-md-6">        <div class="card">        sldcm        </div>        </div>        <div class="col-md-6">        <div class="card">        sldcm        </div>        </div></div>`
    const compare_dat = `<div class="container">  <div class="row">    <div class="col-md-6">        <div class="card">        sldcm        </div>        </div>        <div class="col-md-6">        <div class="card">        sldcm        </div>        </div>        <div class="col-md-6">        <div class="card">        sldcm        </div>        </div></div>`
   
    if (data === compare_dat) {
        console.log("same")
    } else {
        console.log("not same")
    }
     
   


    return (
        <>
            <div className="container" style={{ height: " 90vh" }}>
                <h1>Test</h1>
                <div dangerouslySetInnerHTML={{ __html: data }} />
                <div dangerouslySetInnerHTML={{ __html: compare_dat }} />

            </div>
        </>
    )
}

export default Test