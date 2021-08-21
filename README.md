# are-you-taking

## Backend

Set up Cockroach DB.

```shellscript
curl https://binaries.cockroachdb.com/cockroach-v21.1.7.linux-amd64.tgz | tar -xz; sudo cp -i cockroach-v21.1.7.linux-amd64/cockroach /usr/local/bin/
curl --create-dirs -o $HOME/.postgresql/root.crt -O https://cockroachlabs.cloud/clusters/bc87538b-7a2f-42d4-a7b8-8849964ec9ac/cert
cockroach sql --url 'postgresql://michael:<PASSWORD>@free-tier.gcp-us-central1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full&sslrootcert='$HOME'/.postgresql/root.crt&options=--cluster%3Dvalid-baboon-3069'
```
