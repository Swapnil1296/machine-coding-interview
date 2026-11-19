import { useEffect, useReducer, useState } from 'react'
const steps = ['Personal information', 'Address details', 'Account details', 'Review and submit'];
const fields = [{
    name: 'First name',
    type: 'text',
    key: 'first_name'

}, {
    name: 'Last name',
    type: 'text',
    key: 'last_name'

},
{
    name: 'Email',
    type: 'text',
    key: 'email'

}
    , {
    name: 'Phone number',
    type: 'number',
    key: 'phone_number'

}
    , {
    name: 'Date of birth',
    type: 'date',
    key: 'dob'

}];
const addressFields = [{
    name: 'Country',
    key: 'country',
    type: 'text'
}, {
    name: 'State',
    key: 'state',
    type: 'text'
}, {
    name: 'City',
    key: 'city',
    type: 'text'
}, {
    name: 'Street Name',
    key: 'street_name',
    type: 'text'
},
{
    name: 'Postal Code',
    key: 'postal_code',
    type: 'number'
},
];
const accoutnFields = [
    {
        name: 'UserName',
        key: 'username',
        type: 'text'
    },
    {
        name: 'Password',
        key: 'password',
        type: 'text'
    }, {
        name: 'Confirm password',
        key: 'confirm_password',
        type: 'password'
    }, {
        name: 'Accept terms and conditions',
        key: 'terms',
        type: 'checkbox',
        user_terms: "By submitting my details, I override my NCPR registration and authorize Ageas Federal Life Insurance Company Limited and its representative to contact me through call, WhatsApp, SMS, email or any other mode."
    }
];
const textRegex = /^(?=.{2,})[a-zA-Z]+([\s'-][a-zA-Z]+)*$/;
const phoneRegex = /^[6-9]\d{9}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Allows: john_doe, Alice-99, bob
// Rejects: _john (starts with _), 99bob (starts with digit), jo (too short), has space
const userNameRegex = /^[a-zA-Z][a-zA-Z0-9_-]{2,15}$/;
// 6–20 chars, ≥1 uppercase, ≥1 lowercase, ≥1 digit, ≥1 special char e.g Passw0rd!
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,20}$/;

const fillPercent = (index, currentStep) => {
    if (index < currentStep) return 100
    if (index === currentStep) return 50
    return 0
}
const intialState = {
    personal_info: { first_name: '', last_name: '', dob: '', email: '', phone_number: '' },
    address_details: { country: '', state: '', city: '', street_name: '', postal_code: '' },
    account_details: { username: '', password: '', confirm_password: '', terms: false },
    errors: {},
    statue: 'idle',
};

function reducer(state, action) {
    switch (action.type) {

        case "PERSONAL_INFO_CHANGE": return {
            ...state,
            personal_info: { ...state.personal_info, [action.field]: action.value },
            errors: { ...state.errors, [action.field]: "" },
        };
        case "ADDRESS_DETAILS_CHANGE":
            return {
                ...state, address_details: { ...state?.address_details, [action.field]: action.value },
                errors: { ...state.errors, [action.field]: '' }
            };
        case "ACCOUNT_DETAILS_CHANGE":
            return {
                ...state, account_details: { ...state?.account_details, [action.field]: action.value },
                errors: { ...state.errors, [action.field]: '' }
            };
        case "ERRORS":
            return { ...state, errors: action.errors };
        case "SUBMIT": return { ...state, status: 'submitting', errors: {} };
        case "SUCCESS":
            return { ...intialState, status: 'success' }
        default: return state;
    }
};

const MultiStepUserRegistrationForm = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [state, dispatch] = useReducer(reducer, intialState);

    const handleBack = () => {
        setCurrentStep((prev) => (
            prev > 0 ? prev - 1 : prev
        ))
    };
    console.log("currentStep", currentStep)

    return (
        <>
            <div className='container'>
                <LeftNav currentStep={currentStep} />
                <div className="form_panel">
                    <ProgressBar currentStep={currentStep} setCurrentStep={setCurrentStep} />
                    {currentStep == 0 && <PersonalInfo setCurrentStep={setCurrentStep} state={state} dispatch={dispatch} />}
                    {currentStep == 1 && <AddressDetails setCurrentStep={setCurrentStep} currentStep={currentStep} handleBack={handleBack} state={state} dispatch={dispatch} />}
                    {currentStep == 2 && <AccountDetails setCurrentStep={setCurrentStep} currentStep={currentStep} handleBack={handleBack} state={state} dispatch={dispatch} />}
                </div>

            </div>

        </>
    )
};
const LeftNav = ({ currentStep }) => {
    return (
        <div className='left_container'>
            <div className="left_progress">
                <p>Create Account</p>
                <span>Fill all the required information</span>
            </div>
            <VerticalProgressBar currentStep={currentStep} />
        </div>
    )
}
const VerticalProgressBar = ({ currentStep }) => {
    return (
        <div className="vertical_progress_container">
            {steps.map((name, index) => (
                <div className="vertical_step" key={name}>
                    <div className="vertical_step_track">
                        <div className={index <= currentStep ? 'vertical_progress_list circle_active' : 'vertical_progress_list'}>
                            <span>{index + 1}</span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className="vertical_progress_bar_container">
                                <div
                                    className="vertical_progress_fill"
                                    style={{ height: `${fillPercent(index, currentStep)}%` }}
                                />
                            </div>
                        )}
                    </div>
                    <span className="vertical_step_name">{name}</span>
                </div>
            ))}
        </div>
    )
};
const ProgressBar = ({ currentStep, setCurrentStep }) => {

    return (
        <>
            <nav className="progressbar">
                {steps.map((step, index) => (
                    <div className="steps_bar" key={step}>
                        <div className="step_name">{step}</div>
                        <div className="steps_wrapper">
                            <div
                                className={index <= currentStep ? 'step_circle circle_active' : 'step_circle'}
                                aria-label={step}
                            >
                                <span>{index + 1}</span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="progress_indicator">
                                    <div
                                        className="progress_fill"
                                        style={{ width: `${fillPercent(index, currentStep)}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </nav>
            {/* <div className="progress_actions">
                <button
                    type="button"
                    onClick={() => setCurrentStep((prv) => (prv > 0 ? prv - 1 : prv))}
                    disabled={currentStep === 0}
                >
                    Back
                </button>
                <button
                    type="button"
                    onClick={() => setCurrentStep((prv) => (prv < steps.length - 1 ? prv + 1 : prv))}
                    disabled={currentStep === steps.length - 1}
                >
                    Next
                </button>
            </div> */}

        </>
    )
};

const PersonalInfo = ({ setCurrentStep, state, dispatch }) => {

    const { personal_info, status, errors } = state;

    const handleChange = (e) => {

        dispatch({ type: "PERSONAL_INFO_CHANGE", field: e.target.name, value: e.target.value })
    };
    const validate = () => {
        let errs = {};
        if (!personal_info?.first_name.trim() || !(textRegex.test(personal_info?.first_name))) {
            errs.first_name = "Enter a valid Name"
        }
        if (!personal_info?.last_name.trim() || !(textRegex.test(personal_info?.last_name))) {
            errs.last_name = "Enter a valid Name"
        }
        if (!personal_info?.email || !(emailRegex.test(personal_info?.email))) {
            errs.email = "Enter a Valid Email Address"
        }
        if (!personal_info?.phone_number || !(phoneRegex.test(personal_info?.phone_number))) {
            errs.phone_number = "Enter a Valid phone Number"
        }
        if (!personal_info?.dob) {
            errs.dob = "Enter date of birth"
        }
        return errs;

    }


    const handleSubmit = (e) => {
        e.preventDefault();
        const error = validate();
        if (Object.keys(error).length) {
            dispatch({ type: "ERRORS", errors: error });
            return;
        }
        localStorage.setItem("personal_info", JSON.stringify(personal_info));
        dispatch({ type: "SUCCESS" });
        setCurrentStep((prev) => (prev + 1));

    };
    useEffect(() => {
        const saved = localStorage.getItem("personal_info");
        if (!saved) return;

        const parsed = JSON.parse(saved);
        Object.entries(parsed).forEach(([field, value]) => {
            dispatch({ type: "PERSONAL_INFO_CHANGE", field, value });
        });
    }, []);
    return (
        <div className="personal_info">
            <div className='info_form'>
                <form onSubmit={handleSubmit}>
                    {fields && fields?.map((field, index) => (
                        <div className="info_input" key={field?.key}>
                            <span>{field?.name}</span>
                            <input name={`${field?.key}`} value={personal_info?.[field?.key]} type={field?.type} autoComplete='new-password' onChange={(e) => handleChange(e)} />
                            {errors?.[field.key] && <p className='error_message'>{errors[field.key]}</p>}

                        </div>
                    ))}
                    <button type='submit' className='submit_btn'>Next</button>
                </form>
            </div>
        </div>
    )
};
const AddressDetails = ({ setCurrentStep, currentStep, handleBack, state, dispatch }) => {
    const { address_details, errors, status } = state;
    console.log("address_details", address_details)
    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length) {
            dispatch({ type: "ERRORS", errors });
            return;
        }

        localStorage.setItem("address_details", JSON.stringify(address_details));
        dispatch({ type: "SUCCESS" });
        setCurrentStep((prev) => (prev + 1));
    };

    const handleChange = (e) => {
        dispatch({ type: "ADDRESS_DETAILS_CHANGE", field: e.target.name, value: e.target.value })
    };
    const validate = () => {
        let errs = {}
        if (!address_details?.country?.trim() || !textRegex.test(address_details?.country?.trim())) {
            errs.country = "Enter a valid country name"
        };
        if (!address_details?.state?.trim() || !textRegex.test(address_details?.state?.trim())) {
            errs.state = "Enter a valid state name"
        };
        if (!address_details?.city?.trim() || !textRegex.test(address_details?.city?.trim())) {
            errs.city = "Enter a valid city name"
        };
        if (!address_details?.street_name?.trim() || !textRegex.test(address_details?.street_name?.trim())) {
            errs.street_name = "Enter a valid street name"
        };
        if (!address_details?.postal_code) {
            errs.postal_code = "Enter a valid postal code"
        }
        return errs
    };

    useEffect(() => {
        const saved = localStorage.getItem("address_details");
        if (!saved) return;

        const parsed = JSON.parse(saved);
        Object.entries(parsed).forEach(([field, value]) => {
            dispatch({ type: "ADDRESS_DETAILS_CHANGE", field, value });
        });
    }, []);
    return (
        <div className="address_details">
            <div className='address_form'>
                <form onSubmit={handleSubmit}>
                    {addressFields && addressFields?.map((field, index) => (
                        <div className="info_input" key={field?.key}>
                            <span>{field?.name}</span>

                            <input type={field?.type} name={field?.key} value={address_details?.[field?.key] ?? ''} autoComplete='new-password' onChange={(e) => handleChange(e)} />
                            {errors?.[field.key] && <p className='error_message'>{errors[field.key]}</p>}
                        </div>
                    ))}
                    <div className='btn_group'>
                        {currentStep > 0 ? <button type='submit' className='submit_btn' onClick={handleBack}>Back</button> : null}
                        <button type='submit' className='submit_btn'>Next</button>
                    </div>
                </form>
            </div>
        </div>
    )
};

const AccountDetails = ({ setCurrentStep, currentStep, handleBack, state, dispatch }) => {
    const { account_details, status, errors } = state;
    const handleSubmit = (e) => {
        e.preventDefault();
        const err = validate();
        if (Object.keys(err).length) {
            dispatch({ type: "ERRORS", errors: err })
            return
        }
        localStorage.setItem("account_details", JSON.stringify(account_details));
        dispatch({ type: "SUCCESS" });
        setCurrentStep((prev) => (prev + 1));
    };
    const handleChange = (e) => {
        dispatch({ type: "ACCOUNT_DETAILS_CHANGE", field: e.target.name, value: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
    };
    const validate = () => {
        let errs = {};
        if (!account_details?.terms) {
            errs.terms = 'Please accept terms & conditions.'
        };
        if (!account_details?.username?.trim()) {
            errs.username = "Username is required."
        } else if (!userNameRegex.test(account_details.username.trim())) {
            errs.username = "User name should be mix of characters."
        }

        const password = account_details?.password?.trim() ?? ''
        if (!password) {
            errs.password = "Password is required."
        } else if (!passwordRegex.test(password)) {
            errs.password = "Enter a valid Password (6–20 chars, ≥1 uppercase, ≥1 lowercase, ≥1 digit, ≥1 special char e.g Passw0rd!)"
        }
        if (!account_details?.confirm_password?.trim()) {
            errs.confirm_password = "Password is required."
        };
        if (account_details?.confirm_password?.trim() !== account_details?.password?.trim()) {
            errs.confirm_password = "Password & Confirm Password should match"
        };
        return errs;

    };
    useEffect(() => {
        let saved = localStorage.getItem("account_details");
        if (!saved) return;
        const parsed = JSON.parse(saved);
        Object.entries(parsed).forEach(([field, value]) => {
            dispatch({ type: "ACCOUNT_DETAILS_CHANGE", field, value });
        })
    }, []);
    return (
        <div className="address_details">
            <div className='address_form'>
                <form onSubmit={handleSubmit}>
                    {accoutnFields && accoutnFields?.map((field, index) => (
                        <div className="info_input" key={field?.key}>
                            <span>{field?.name}</span>

                            <input
                                type={field?.type}
                                name={field?.key}
                                autoComplete='new-password'
                                onChange={(e) => handleChange(e)}
                                {...(field?.type === 'checkbox'
                                    ? { checked: Boolean(account_details?.[field?.key]) }
                                    : { value: account_details?.[field?.key] ?? '' })}
                            />
                            {errors?.[field.key] && <p className='error_message'>{errors[field.key]}</p>}
                            {field?.type === 'checkbox' && field?.user_terms ? <p> {field?.user_terms}</p> : null}
                        </div>
                    ))}
                    <div className='btn_group'>
                        {currentStep > 0 ? <button type='submit' className='submit_btn' onClick={handleBack}>Back</button> : null}
                        <button type='submit' className='submit_btn'>Next</button>
                    </div>
                </form>
            </div>
        </div>
    )
};
export default MultiStepUserRegistrationForm
