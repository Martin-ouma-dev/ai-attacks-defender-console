"""Ingress boundary; proxy headers must only be trusted from configured proxies."""

from ipaddress import ip_address


def validate_source_ip(value: str) -> str:
    return str(ip_address(value))
