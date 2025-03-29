import React, { useState, useMemo, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  CssBaseline, 
  ThemeProvider, 
  LinearProgress,
  InputAdornment,
  IconButton,
  Divider,
  Link,
  createTheme
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ThemeProvider as Emotion10ThemeProvider } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import useApi from '../hooks/APIHandler';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { login } from '../redux/reducer/IsLoggedInReducer';
import { GlobalStyles } from '../layout/GlobalStyle';
import { orangeDarkTheme, orangeLightTheme, basicTheme, darkTheme, lightTheme, customTheme, blueLightTheme, blueDarkTheme, greenLightTheme, greenDarkTheme, redLightTheme, redDarkTheme } from '../layout/themes';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [themeMode, setThemeMode] = useState('basic');
  const [showPassword, setShowPassword] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const navigate = useNavigate();
  const { callApi, loading } = useApi();
  const dispatch = useDispatch();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'basic';
    setThemeMode(savedTheme);
  }, []);

  const theme = useMemo(() => {
    switch (themeMode) {
      case 'basic': return createTheme(basicTheme);
      case 'dark': return createTheme(darkTheme);
      case 'light': return createTheme(lightTheme);
      case 'custom': return createTheme(customTheme);
      case 'blue light': return createTheme(blueLightTheme);
      case 'blue dark': return createTheme(blueDarkTheme);
      case 'green light': return createTheme(greenLightTheme);
      case 'green dark': return createTheme(greenDarkTheme);
      case 'red light': return createTheme(redLightTheme);
      case 'red dark': return createTheme(redDarkTheme);
      case 'orange light': return createTheme(orangeLightTheme);
      case 'orange dark': return createTheme(orangeDarkTheme);
      default: return createTheme(lightTheme);
    }
  }, [themeMode]);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (showResetForm) {
      // Logique pour la réinitialisation du mot de passe
      toast.success("Un lien de réinitialisation a été envoyé à votre email");
      setShowResetForm(false);
      return;
    }

    const formData = {
      username: e.target.username.value,
      password: e.target.password.value
    };

    if (!isLogin) {
      formData.email = e.target.email.value;
    }

    const endpoint = isLogin ? "auth/login/" : "auth/signup/";
    const successMessage = isLogin ? "Connexion réussie" : "Inscription réussie";

    const response = await callApi({ 
      url: endpoint, 
      method: "POST", 
      body: formData 
    });
    
    if (response?.data?.access) {
      localStorage.setItem("token", response.data.access);
      toast.success(successMessage);
      dispatch(login());
      navigate("/home");
    } else {
      toast.error(isLogin ? "Identifiants invalides" : "Échec de l'inscription");
    }
  };

  return (
    <Emotion10ThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            p: 3
          }}
        >
          <Card 
            sx={{ 
              maxWidth: 500, 
              width: '100%',
              borderRadius: 4,
              boxShadow: theme.shadows[10],
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                color: theme.palette.primary.contrastText,
                textAlign: 'center',
                py: 4
              }}
            >
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700,
                  letterSpacing: 1,
                  mb: 0
                }}
              >
                Financial Wellness
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 500,
                  letterSpacing: 1,
                  mb: 1
                }}
              >
                Personal & Organisational Intelligence
              </Typography>
              <Typography variant="subtitle1">
                {showResetForm 
                  ? "Reset your password" 
                  : isLogin 
                    ? "Sign in to your account" 
                    : "Create your account"}
              </Typography>
            </Box>

            <CardContent sx={{ px: 4, py: 3 }}>
              {showResetForm ? (
                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    required
                    name="email"
                    label="Email address"
                    type="email"
                    autoComplete="email"
                  />
                  
                  {loading ? (
                    <LinearProgress sx={{ mt: 3, mb: 2 }} />
                  ) : (
                    <>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{
                          mt: 3,
                          mb: 2,
                          py: 1.5,
                          borderRadius: 2,
                          fontWeight: 600
                        }}
                      >
                        Send me reset link
                      </Button>
                      <Button
                        fullWidth
                        variant="text"
                        size="small"
                        onClick={() => setShowResetForm(false)}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 500
                        }}
                      >
                        Go back in sign in
                      </Button>
                    </>
                  )}
                </Box>
              ) : (
                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    required
                    name="username"
                    label="Username"
                    autoComplete="username"
                    autoFocus
                  />

                  {!isLogin && (
                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      required
                      name="email"
                      label="Adresse email"
                      type="email"
                      autoComplete="email"
                    />
                  )}

                  <TextField
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    required
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />

                  {isLogin && (
                    <Box sx={{ textAlign: 'right', mt: 1 }}>
                      <Link 
                        component="button" 
                        variant="body2"
                        onClick={() => setShowResetForm(true)}
                        sx={{
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        forgot your password ?
                      </Link>
                    </Box>
                  )}

                  {loading ? (
                    <LinearProgress sx={{ mt: 3, mb: 2 }} />
                  ) : (
                    <>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{
                          mt: 3,
                          mb: 2,
                          py: 1.5,
                          borderRadius: 2,
                          fontWeight: 600
                        }}
                      >
                        {isLogin ? "Sign in" : "Sign up"}
                      </Button>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Button
                        fullWidth
                        variant="text"
                        onClick={() => setIsLogin(!isLogin)}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 500
                        }}
                      >
                        {isLogin 
                          ? "Don't have an account ? Sign Up" 
                          : "Have an account ? Sign In"}
                      </Button>
                    </>
                  )}
                </Box>
              )}
            </CardContent>

            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 2,
                borderTop: '1px solid', 
                borderColor: theme.palette.divider 
              }}
            >
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} Financial Wellness. All rights reserved.
              </Typography>
            </Box>
          </Card>
        </Box>
      </ThemeProvider>
    </Emotion10ThemeProvider>
  );
};

export default Auth;