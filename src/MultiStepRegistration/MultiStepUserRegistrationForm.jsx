import { useState } from 'react'
 const steps = ['Personal information', 'Address details', 'Account details', 'Review and submit']

const fillPercent = (index, currentStep) => {
    if (index < currentStep) return 100
    if (index === currentStep) return 50
    return 0
}

const MultiStepUserRegistrationForm = () => {
    const [currentStep, setCurrentStep] = useState(0)

    return (
        <>
        <div className='container'>
            <LeftNav currentStep={currentStep} />
            <ProgressBar currentStep={currentStep} setCurrentStep={setCurrentStep} />
                
                     <PersonalInfo/>
          
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
                        <div className="step_name">{step }</div>
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

const PersonalInfo = () => {
    const fields = [{
        name: 'First name',
        type: 'text',
        key:'first_name'

    }, {
        name: 'Last name',
        type: 'text',
        key:'last_name'

    },
    {
        name: 'Email',
        type: 'email',
        key:'email'

    }
        , {
        name: 'Phone number',
            type: 'number',
            key:'phone_number'

    }
        , {
        name: 'Date of birth',
            type: 'date',
        key:'dob'

    }]
    return (
        <div className="personal_info">
            <div className='info_form'>
                <form action="">
                    {fields && fields?.map((field, index) => (
                     <div className="info_input" key={field?.key}>
                            <span>{field?.name}</span> 
                            <input name={`field-${field?.name}`}  type={field?.type} autoComplete='new-password'/>
                          
                     </div>   
                    ))}
                      <button type='submit' className='submit_btn'>Next</button>
                </form>
           </div>
        </div>
    )
}

export default MultiStepUserRegistrationForm
