#!/usr/bin/env python3
import argparse
import json
import os
import subprocess
from pprint import pprint

THIS_DIR = os.path.dirname(os.path.abspath(__file__))


def _get_stack_name(stage: str) -> str:
    return f"bc-gay-backend-v0-{stage}"


def _find_stack(stack_descriptions: dict, stack_name: str):
    for stack in stack_descriptions["Stacks"]:
        if stack["StackName"] == stack_name:
            return stack
    return None


def _find_stack_output(stack: dict, output_key: str):
    for stack_output in stack["Outputs"]:
        if stack_output["OutputKey"] == output_key:
            return stack_output["OutputValue"]
    return None


def _collect_bc_gay_secrets(stack, stage):
    pprint(stack)
    return dict(
        stage=stage,
        user_pool_id=_find_stack_output(stack, "BCCognitoUserPoolId"),
        user_pool_client_id=_find_stack_output(stack, "BCCognitoUserPoolClientId"),
        user_pool_client_hosted_ui_domain=_find_stack_output(
            stack, "BCUserPoolClientHostedUIDomainName"
        ),
        internal_gql_api_url=_find_stack_output(stack, "GraphQlApiUrl"),
    )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--stage", choices=["devl", "prod"], default="devl")
    args = parser.parse_args()

    stack_name = _get_stack_name(args.stage)

    proc = subprocess.Popen(
        "aws cloudformation describe-stacks",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        shell=True,
    )

    try:
        outs, errs = proc.communicate(timeout=15)
    except subprocess.TimeoutExpired:
        proc.kill()
        outs, errs = proc.communicate()
    if errs:
        print(errs)
        exit(1)

    stack_descriptions = json.loads(outs)
    secrets = _collect_bc_gay_secrets(
        stack=_find_stack(stack_descriptions, stack_name), stage=args.stage
    )

    with open(os.path.join(THIS_DIR, "secrets/bc_gay_app.json"), "w") as f:
        json.dump(secrets, f, indent=2)

    print("done")


if __name__ == "__main__":
    main()
