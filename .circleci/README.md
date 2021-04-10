

### Devops stack

1. CircleCI
2. Ansible


### What this strategy does?

1. Audit, build, and test the `client` code.
2. Audit, validate, and test the `server` code.
3. Deploy the code in the target's VM through Ansible.
4. Configure the remote machine, install dependencies, and execute the app through a process manager.

---

### Build trigger

Essentially, every commit in the repository will trigger some kind of build, as described below.

#### Master branch

Simply put, if it is merged on `master` it is meant to be moved to production; the full workflow is executed.

#### Other branches

We don't want all branches moving code to our servers, but we want some validation; frontend and backend code are built and validated.

#### Exceptions

Other exceptions may arise and result in branches bypassing the build phase altogether. As of today, there are no branches in that position.

---


### Build dependencies

To configure the service and enable it to run end to end, it has some premises, as documented below:

#### Environment files

The service must have the environment variables configured - usually they are the same as found in the backend app.

#### Private key

The service must have the private key needed to connect in the remote machine available. The key's fingerprint is also required.

#### Server host

The Ansible's inventory file consider the following host: `server.igrejaemsumare.com.br`
