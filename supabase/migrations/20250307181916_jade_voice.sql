/*
  # Initial Schema Setup

  1. Tables
    - users (managed by Supabase Auth)
    - transactions
      - id (uuid, primary key)
      - user_id (references auth.users)
      - date (timestamp)
      - description (text)
      - amount (numeric)
      - category (text)
      - card_id (uuid, optional)
    - cards
      - id (uuid, primary key)
      - user_id (references auth.users)
      - name (text)
      - type (text)
      - last_four_digits (text)
      - due_date (integer)
      - credit_limit (numeric, optional)
    - loans
      - id (uuid, primary key)
      - user_id (references auth.users)
      - name (text)
      - total_amount (numeric)
      - remaining_amount (numeric)
      - emi_amount (numeric)
      - due_date (integer)
      - start_date (date)
      - end_date (date)
    - salary_allocations
      - id (uuid, primary key)
      - user_id (references auth.users)
      - category (text)
      - amount (numeric)
      - percentage (numeric)
    - credit_scores
      - id (uuid, primary key)
      - user_id (references auth.users)
      - bureau (text)
      - score (integer)
      - last_updated (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for user-specific data access
*/

-- Transactions Table
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  date timestamptz NOT NULL,
  description text NOT NULL,
  amount numeric NOT NULL,
  category text NOT NULL,
  card_id uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their own transactions"
  ON transactions
  USING (auth.uid() = user_id);

-- Cards Table
CREATE TABLE cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  last_four_digits text NOT NULL,
  due_date integer,
  credit_limit numeric,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their own cards"
  ON cards
  USING (auth.uid() = user_id);

-- Loans Table
CREATE TABLE loans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  total_amount numeric NOT NULL,
  remaining_amount numeric NOT NULL,
  emi_amount numeric NOT NULL,
  due_date integer NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their own loans"
  ON loans
  USING (auth.uid() = user_id);

-- Salary Allocations Table
CREATE TABLE salary_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  category text NOT NULL,
  amount numeric NOT NULL,
  percentage numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE salary_allocations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their own salary allocations"
  ON salary_allocations
  USING (auth.uid() = user_id);

-- Credit Scores Table
CREATE TABLE credit_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  bureau text NOT NULL,
  score integer NOT NULL,
  last_updated timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE credit_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their own credit scores"
  ON credit_scores
  USING (auth.uid() = user_id);

-- Indexes for better query performance
CREATE INDEX transactions_user_id_idx ON transactions(user_id);
CREATE INDEX cards_user_id_idx ON cards(user_id);
CREATE INDEX loans_user_id_idx ON loans(user_id);
CREATE INDEX salary_allocations_user_id_idx ON salary_allocations(user_id);
CREATE INDEX credit_scores_user_id_idx ON credit_scores(user_id);