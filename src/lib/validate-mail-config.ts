export function validateMailConfig(): void {
  const requiredVars = ['MAILTRAP_USER', 'MAILTRAP_PASS'];
  const missing = requiredVars.filter((v) => !process.env[v]);

  if (missing.length > 0) {
    console.error(`❌ Variables Mailtrap manquantes: ${missing.join(', ')}`);
    console.error('→ Consulte docs/MAILTRAP_SETUP.md');
    // Strict: abort when Mailtrap credentials missing
    process.exit(1);
  }

  // Optional sender
  if (!process.env.MAIL_FROM_ADDRESS) {
    console.warn('⚠️ MAIL_FROM_ADDRESS non défini — utilisé par défaut: noreply@restaurant.local');
  }

  // Check staff emails (warning only)
  const staffVars = ['MANAGER_EMAIL', 'BARTENDER_EMAIL', 'WAITER_EMAIL', 'KITCHEN_EMAIL'];
  const missingStaff = staffVars.filter((v) => !process.env[v]);
  if (missingStaff.length > 0) {
    console.warn(`⚠️ Emails personnel manquants: ${missingStaff.join(', ')}`);
    console.warn('→ Les notifications pour ces rôles ne seront pas envoyées');
  } else {
    console.log('✅ Configuration emails personnel OK');
  }

  console.log('✅ Configuration Mailtrap OK');
}
