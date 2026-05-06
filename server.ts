import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { connectDB } from './server/config/db';
import authRoutes from './server/routes/auth';
import leaveRoutes from './server/routes/leave';
import adminRoutes from './server/routes/admin';

async function startServer() {
  await connectDB();
  
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/leave', leaveRoutes);
  app.use('/api/admin', adminRoutes);

  // Vite + Express setup for fullstack
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Error handling middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
