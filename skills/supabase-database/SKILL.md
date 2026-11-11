---
name: supabase-database
description: Guidelines and SQL migration patterns for Supabase (PostgreSQL 15), Row-Level Security (RLS), Supabase Storage buckets, and Realtime event subscriptions for aquaculture telemetry and diagnostic logs.
license: MIT
---

# Supabase Database Skill

This skill provides best practices for configuring **Supabase** (managed PostgreSQL, Object Storage, and Realtime WebSocket events) for AquaGuard AI.

## 1. Core Architecture

* **Database Engine:** PostgreSQL 15.
* **Storage Bucket:** Public bucket `fish-scans` storing uploaded images with unique UUID prefixes.
* **Security Model:** Row-Level Security (RLS) enabled on all tables.
* **Realtime Engine:** Pub/Sub replication enabled on the `alerts` table to push emergency warnings directly to connected frontend clients.

---

## 2. Production Schema Definition

```sql
-- Ponds Table
CREATE TABLE IF NOT EXISTS public.ponds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    species_farmed VARCHAR(100) NOT NULL DEFAULT 'Nile Tilapia',
    area_hectares NUMERIC(6,2) DEFAULT 1.0,
    depth_meters NUMERIC(4,2) DEFAULT 1.5,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Water Quality Telemetry Table
CREATE TABLE IF NOT EXISTS public.water_quality_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pond_id UUID REFERENCES public.ponds(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    dissolved_oxygen NUMERIC(5,2) NOT NULL,
    ph NUMERIC(4,2) NOT NULL,
    temperature NUMERIC(5,2) NOT NULL,
    ammonia NUMERIC(5,3) NOT NULL,
    turbidity NUMERIC(6,2),
    hazard_score NUMERIC(5,2) NOT NULL
);

-- Diagnostic Scans Table
CREATE TABLE IF NOT EXISTS public.diagnostic_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pond_id UUID REFERENCES public.ponds(id) ON DELETE CASCADE,
    scanned_at TIMESTAMPTZ DEFAULT NOW(),
    image_url TEXT NOT NULL,
    predicted_disease VARCHAR(100) NOT NULL,
    confidence NUMERIC(5,4) NOT NULL,
    composite_risk_score NUMERIC(5,2) NOT NULL,
    risk_tier VARCHAR(50) NOT NULL,
    advisory_payload JSONB NOT NULL
);

-- Alerts Table
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pond_id UUID REFERENCES public.ponds(id) ON DELETE CASCADE,
    scan_id UUID REFERENCES public.diagnostic_scans(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    severity VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE
);

-- Enable Realtime Replication on Alerts
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;
```

---

## 3. Python Supabase Client Integration

```python
from supabase import create_client, Client
import os

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

async def upload_fish_scan(image_bytes: bytes, filename: str) -> str:
    path = f"scans/{filename}"
    supabase.storage.from_("fish-scans").upload(path, image_bytes)
    public_url = supabase.storage.from_("fish-scans").get_public_url(path)
    return public_url
```

