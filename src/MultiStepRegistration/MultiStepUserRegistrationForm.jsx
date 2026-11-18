import { useState } from 'react'
 const steps = ['Personal information', 'Address details', 'Account details', 'Review and submit']
const MultiStepUserRegistrationForm = () => {
    return (
        <div className='container'>
            <LeftNav/>
            <ProgressBar />
        </div>
    )
};
const LeftNav = () => {
    return (
        <div className='left_container'>
            <div className="left_progress">
                <p>Create Account</p>  
                <span>Fill all the required information</span>
            </div>
            <VerticalProgressBar/>
        </div>
    )
}
const VerticalProgressBar = () => {
    
    return (
        <div className="vertical_progress_container">
            {steps && steps?.map((name, index) => (
                <>
                <div className="vertical_progress_list">
                    <span>{index+1 }</span>
                </div>
                    {index < steps?.length - 1 && <div className="vertical_progress_bar_container">
                        <div className="vertical_progress_fill" style={{width:'100%'}}></div>
                    </div>}
                </>
          ))}
        </div>
    )
};
const ProgressBar = () => {
   
    const [currentStep, setCurrentStep] = useState(0)

    const fillPercent = (index) => {
        console.log("currentStep",{currentStep,index})
        if (index < currentStep) return 100;
        if (index === currentStep) return 50;
        return 0;
    }

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
                                    style={{ width: `${fillPercent(index)}%` }}
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

export default MultiStepUserRegistrationForm
