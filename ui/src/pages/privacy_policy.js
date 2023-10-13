import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button, FormText, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";

import Util from '../helpers/util';
import { useStore } from '../store';

import {Faqs} from "../components/faqs";
import { BannerWidget } from "../components/banner_widget";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const PrivacyPolicy = (props) => {
    const { showToast } = props;

    const pp = `
Privacy Policy for BeenThere Hiking/Adventure App

At BeenThere, we take your privacy very seriously. This privacy policy explains how we collect, use, and disclose your personal information when you use our BeenThere Hiking/Adventure app.

Information We Collect
When you use our app, we may collect the following information from you:

* Your phone number
* Your name
* Your email address
* Information about your location
* Information about your activity on our app
* Any other information you choose to provide to us

How We Use Your Information
We use the information we collect from you to:

Provide you with our services
Improve our services
Communicate with you about our services
Respond to your requests and inquiries
Protect against fraudulent or illegal activity
Enforce our terms of service
We may also use your information for other purposes that we disclose to you at the time we collect the information or with your consent.

How We Share Your Information
We do not sell your personal information to third parties. We may share your information with:

Our service providers who assist us in providing our services, such as hosting and data storage providers
Our affiliates and subsidiaries
Law enforcement, government agencies, or authorized third parties when required by law or in response to a subpoena or other legal process
Other parties with your consent or at your direction
We may also share aggregated or de-identified information that cannot be used to identify you.

Data Security
We take appropriate measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee the absolute security of your information.

Children's Privacy
Our services are not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe that we may have collected information from a child under 13, please contact us at the email address below.

Changes to this Privacy Policy
We may update this privacy policy from time to time. We will notify you of any material changes by posting the updated policy on our website or within our app.

Contact Us
If you have any questions or concerns about this privacy policy or our practices, you may contact us at [insert email address].
`

    return (
        <>
            <BannerWidget
                title="Privacy Policy"
                />

            <div style={{ all: 'initial'}}>
                <ReactMarkdown children={pp} remarkPlugins={[remarkGfm]} />
            </div>

            <Faqs />
        </>
    )
}

