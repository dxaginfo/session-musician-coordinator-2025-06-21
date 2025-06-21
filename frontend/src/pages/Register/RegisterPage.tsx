import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Box,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

type UserType = 'musician' | 'client';

interface RegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  userType: UserType;
}

const steps = ['Account Details', 'Personal Information', 'Profile Type'];

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<RegistrationData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    userType: 'musician'
  });

  // Form validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [nameError, setNameError] = useState('');

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = regex.test(email);
    setEmailError(isValid ? '' : 'Please enter a valid email address');
    return isValid;
  };

  const validatePassword = (password: string): boolean => {
    const isValid = password.length >= 8;
    setPasswordError(isValid ? '' : 'Password must be at least 8 characters long');
    return isValid;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): boolean => {
    const isValid = password === confirmPassword;
    setConfirmPasswordError(isValid ? '' : 'Passwords do not match');
    return isValid;
  };

  const validateName = (name: string): boolean => {
    const isValid = name.trim().length > 0;
    setNameError(isValid ? '' : 'Name is required');
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear errors when typing
    if (name === 'email') setEmailError('');
    if (name === 'password') setPasswordError('');
    if (name === 'confirmPassword') setConfirmPasswordError('');
    if (name === 'name') setNameError('');
  };

  const handleNext = () => {
    let isValid = true;

    // Validate current step
    if (activeStep === 0) {
      isValid = validateEmail(formData.email);
    } else if (activeStep === 1) {
      isValid = validatePassword(formData.password) && 
                validateConfirmPassword(formData.password, formData.confirmPassword);
    } else if (activeStep === 2) {
      isValid = validateName(formData.name);
    }

    if (isValid) {
      if (activeStep === steps.length - 1) {
        handleSubmit();
      } else {
        setActiveStep((prevStep) => prevStep + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    // Final validation of all fields
    const isEmailValid = validateEmail(formData.email);
    const isPasswordValid = validatePassword(formData.password);
    const isConfirmPasswordValid = validateConfirmPassword(formData.password, formData.confirmPassword);
    const isNameValid = validateName(formData.name);

    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid || !isNameValid) {
      setError('Please fix the validation errors before submitting');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // API call would go here
      // const response = await api.register(formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect based on user type
      if (formData.userType === 'musician') {
        navigate('/musician-profile-setup');
      } else {
        navigate('/client-profile-setup');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Email Address"
              variant="outlined"
              fullWidth
              margin="normal"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!emailError}
              helperText={emailError}
              required
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              error={!!passwordError}
              helperText={passwordError}
              required
            />
            <TextField
              label="Confirm Password"
              variant="outlined"
              fullWidth
              margin="normal"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={!!confirmPasswordError}
              helperText={confirmPasswordError}
              required
            />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              margin="normal"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={!!nameError}
              helperText={nameError}
              required
            />
            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel component="legend">I am a:</FormLabel>
              <RadioGroup
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
                row
              >
                <FormControlLabel 
                  value="musician" 
                  control={<Radio />} 
                  label="Musician" 
                />
                <FormControlLabel 
                  value="client" 
                  control={<Radio />} 
                  label="Studio/Producer" 
                />
              </RadioGroup>
            </FormControl>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Create Your Account
        </Typography>
        <Typography variant="body1" paragraph align="center" color="text.secondary">
          Join the Session Musician Coordinator platform to connect with talented musicians and exciting projects.
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0 || loading}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : activeStep === steps.length - 1 ? (
              'Register'
            ) : (
              'Next'
            )}
          </Button>
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Button
              onClick={() => navigate('/login')}
              color="primary"
              sx={{ textTransform: 'none' }}
            >
              Sign in
            </Button>
          </Typography>
        </Box>
      </Paper>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RegisterPage;