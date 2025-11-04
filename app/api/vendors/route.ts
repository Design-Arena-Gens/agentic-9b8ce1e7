import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

function error(errors: Record<string, string>, message = 'Invalid form submission') {
  return NextResponse.json({ ok: false, message, errors }, { status: 400 });
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ ok: false, message: 'Expected multipart form data' }, { status: 415 });
    }

    const formData = await req.formData();

    const firstName = String(formData.get('firstName') || '').trim();
    const lastName = String(formData.get('lastName') || '').trim();
    const company = String(formData.get('company') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const resourceList = String(formData.get('resourceList') || '').trim();
    const currency = String(formData.get('currency') || 'USD');

    const minBudgetRaw = formData.get('minBudget');
    const maxBudgetRaw = formData.get('maxBudget');

    const errors: Record<string, string> = {};

    if (!firstName) errors.firstName = 'First name is required';

    const minBudget = Number(minBudgetRaw);
    const maxBudget = Number(maxBudgetRaw);

    if (Number.isNaN(minBudget)) errors.minBudget = 'Min budget must be a number';
    if (Number.isNaN(maxBudget)) errors.maxBudget = 'Max budget must be a number';
    if (!Number.isNaN(minBudget) && !Number.isNaN(maxBudget) && minBudget > maxBudget) {
      errors.maxBudget = 'Max budget must be greater than or equal to min budget';
    }

    const cv = formData.get('cv');
    const rateCard = formData.get('rateCard');

    const maxSize = 10 * 1024 * 1024; // 10MB

    function validateFile(field: string, value: FormDataEntryValue | null) {
      if (!value) return;
      if (typeof value === 'string') return;
      const file = value as File;
      if (file.size > maxSize) {
        errors[field] = 'File size exceeds 10MB';
      }
    }

    validateFile('cv', cv);
    validateFile('rateCard', rateCard);

    if (Object.keys(errors).length > 0) {
      return error(errors);
    }

    // In a real application, you would persist the submission and upload files to storage.
    // For this demo, we simply acknowledge the receipt.

    const summary = {
      firstName,
      lastName,
      company,
      email,
      resourceList,
      currency,
      minBudget,
      maxBudget,
      hasCv: typeof cv !== 'string' && !!cv,
      hasRateCard: typeof rateCard !== 'string' && !!rateCard,
    };

    return NextResponse.json({ ok: true, message: 'Submission received. Thank you!', summary }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ ok: false, message: 'Unexpected error' }, { status: 500 });
  }
}
