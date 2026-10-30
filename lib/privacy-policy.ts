import 'server-only';

/**
 * Privacy publication must be independently authorized before any new lead can
 * be accepted. An approved flag alone is insufficient without a policy version
 * and a fixed effective date. Never derive the effective date from Date.now().
 */
export function isPrivacyPolicyPublished(){
 const version=process.env.PRIVACY_POLICY_VERSION?.trim()||'';
 const date=process.env.PRIVACY_POLICY_EFFECTIVE_DATE?.trim()||'';
 if(process.env.PRIVACY_POLICY_APPROVED!=='true'||version.length<3)return false;
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return false;
 const parsed=new Date(date+'T00:00:00Z');
 return !Number.isNaN(parsed.getTime())&&parsed.toISOString().slice(0,10)===date;
}
export function privacyPublicationMetadata(){
 return {
  version:process.env.PRIVACY_POLICY_VERSION?.trim()||'',
  effectiveDate:process.env.PRIVACY_POLICY_EFFECTIVE_DATE?.trim()||''
 };
}
