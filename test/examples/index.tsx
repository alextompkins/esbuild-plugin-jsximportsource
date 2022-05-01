import React from 'react';
import { createRoot } from 'react-dom/client';

import { Component } from './noPragma.example';

const root = createRoot(document.getElementById('root') ?? document.body);
root.render(<Component />);
