-- Use Postgres to create a bucket.
insert into storage.buckets
  (id, name, public)
values
  ('uploads', 'uploads', true);

-- Create storage policies to allow anyone to upload, download and remove files
create policy "Anyone can upload files"
on storage.objects for insert
with check (bucket_id = 'uploads');

create policy "Anyone can download files" 
on storage.objects for select
using (bucket_id = 'uploads');

create policy "Anyone can delete files"
on storage.objects for delete
using (bucket_id = 'uploads');
