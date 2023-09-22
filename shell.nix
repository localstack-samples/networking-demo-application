{ pkgs ? import <nixpkgs> { } }:
with pkgs;
mkShell {
  packages = [
    docker
  ];
}

