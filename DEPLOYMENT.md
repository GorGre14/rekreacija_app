# Deployment Guide

## Vercel Environment Variables

Configure these environment variables in your Vercel dashboard:

### Backend Environment Variables
- `DATABASE_URL` = `postgresql://neondb_owner:npg_pLDlsHknz5T1@ep-aged-boat-a2wzl3ce-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
- `JWT_SECRET` = `your_production_jwt_secret_here`
- `PORT` = `4000` (optional, Vercel handles this)
- `CORS_ORIGIN` = `https://your-frontend-domain.vercel.app`

### Frontend Environment Variables
- `REACT_APP_API_BASE` = `https://your-app-domain.vercel.app/api`

## Deployment Steps

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

## Post-Deployment

- Update `CORS_ORIGIN` with actual frontend URL after first deployment
- Update `REACT_APP_API_BASE` with actual API URL after first deployment

## File Structure
- Frontend builds to `frontend/build/`
- Backend API served from `backend/api/index.js`
- API routes prefixed with `/api/`