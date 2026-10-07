import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { useAuth } from '../context/useAuth';
import { api } from '../services/api';

export function RegisterPage({ onToggleLogin }) {
  const { register, loginAsDemo, authError, setAuthError } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setAuthError(null);

    if (!name.trim()) {
      setLocalError('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      setLocalError('Please enter your email address.');
      return;
    }

    if (!password || password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await register(name.trim(), email.trim(), password);
      if (!result.success) {
        setLocalError(result.error);
      }
    } catch (err) {
      setLocalError(err.message || 'Unable to create account. Backend may be offline.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const errorMessage = localError || authError;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      background: 'radial-gradient(ellipse at 50% 20%, #173623 0%, #111e16 40%, #0d0d0d 80%, #080808 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle background ambient glow */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(181, 154, 98, 0.12) 0%, rgba(21, 49, 32, 0) 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '460px',
        background: 'rgba(24, 24, 24, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(181, 154, 98, 0.28)',
        borderRadius: '16px',
        padding: '36px 30px',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.04)',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <BrandLogo size="md" />
          </div>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '22px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#f5f5f5',
            margin: '0 0 4px 0'
          }}>
            SILVER CATERING
          </h1>
          <div style={{
            fontSize: '11px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--gold-accent)',
            fontWeight: 600,
            marginBottom: '8px'
          }}>
            Create Staff / Admin Account
          </div>
          <div style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            fontWeight: 400
          }}>
            Register to create quotations, invoices & manage clients
          </div>
        </div>

        {/* Error notification banner */}
        {errorMessage && (
          <div style={{
            marginBottom: '18px',
            padding: '12px 14px',
            borderRadius: '8px',
            backgroundColor: 'rgba(207, 76, 76, 0.15)',
            border: '1px solid rgba(207, 76, 76, 0.4)',
            color: '#ff9494',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            lineHeight: 1.45
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '1px', color: '#ff6b6b' }} />
            <div style={{ flex: 1 }}>{errorMessage}</div>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-secondary)',
              marginBottom: '6px'
            }}>
              Full Name
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <User size={16} style={{
                position: 'absolute',
                left: '14px',
                color: 'var(--text-muted)',
                pointerEvents: 'none'
              }} />
              <input
                type="text"
                required
                placeholder="e.g. Nihal M V"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 40px',
                  backgroundColor: '#181818',
                  border: '1px solid var(--border-light)',
                  borderRadius: '8px',
                  color: '#f5f5f5',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--gold-accent)';
                  e.target.style.boxShadow = '0 0 0 2px rgba(181, 154, 98, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-light)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Email Address */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-secondary)',
              marginBottom: '6px'
            }}>
              Email Address
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={16} style={{
                position: 'absolute',
                left: '14px',
                color: 'var(--text-muted)',
                pointerEvents: 'none'
              }} />
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="name@silvercatering.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 40px',
                  backgroundColor: '#181818',
                  border: '1px solid var(--border-light)',
                  borderRadius: '8px',
                  color: '#f5f5f5',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--gold-accent)';
                  e.target.style.boxShadow = '0 0 0 2px rgba(181, 154, 98, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-light)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-secondary)',
              marginBottom: '6px'
            }}>
              Password (min. 6 characters)
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={16} style={{
                position: 'absolute',
                left: '14px',
                color: 'var(--text-muted)',
                pointerEvents: 'none'
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 42px 10px 40px',
                  backgroundColor: '#181818',
                  border: '1px solid var(--border-light)',
                  borderRadius: '8px',
                  color: '#f5f5f5',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--gold-accent)';
                  e.target.style.boxShadow = '0 0 0 2px rgba(181, 154, 98, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-light)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '22px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-secondary)',
              marginBottom: '6px'
            }}>
              Confirm Password
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={16} style={{
                position: 'absolute',
                left: '14px',
                color: 'var(--text-muted)',
                pointerEvents: 'none'
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 40px',
                  backgroundColor: '#181818',
                  border: '1px solid var(--border-light)',
                  borderRadius: '8px',
                  color: '#f5f5f5',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--gold-accent)';
                  e.target.style.boxShadow = '0 0 0 2px rgba(181, 154, 98, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-light)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(181, 154, 98, 0.25)',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.8 : 1
            }}
          >
            {isSubmitting ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <UserPlus size={16} />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          margin: '20px 0 16px'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            OR
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
        </div>

        {/* Fast Offline Demo Access Button */}
        <button
          type="button"
          onClick={loginAsDemo}
          style={{
            width: '100%',
            padding: '10px 14px',
            backgroundColor: 'rgba(21, 49, 32, 0.45)',
            border: '1px solid rgba(63, 174, 104, 0.35)',
            borderRadius: '8px',
            color: '#a7f3d0',
            fontSize: '13px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.2s, border-color 0.2s',
            marginBottom: '18px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(21, 49, 32, 0.7)';
            e.currentTarget.style.borderColor = 'rgba(63, 174, 104, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(21, 49, 32, 0.45)';
            e.currentTarget.style.borderColor = 'rgba(63, 174, 104, 0.35)';
          }}
        >
          <Sparkles size={15} color="#34d399" />
          <span>Continue in Offline / Demo Mode</span>
        </button>

        {/* Back to Login */}
        <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={onToggleLogin}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--gold-accent)',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '0 2px',
              textDecoration: 'underline',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <ArrowLeft size={13} />
            <span>Sign In Instead</span>
          </button>
        </div>

        {/* Backend Endpoint Status Info */}
        <div style={{
          marginTop: '22px',
          paddingTop: '14px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          fontSize: '11px',
          color: 'var(--text-muted)'
        }}>
          <ShieldCheck size={13} color="var(--gold-accent)" />
          <span>API: {api.baseUrl.replace(/^https?:\/\//, '')}</span>
        </div>
      </div>
    </div>
  );
}
export default RegisterPage;
