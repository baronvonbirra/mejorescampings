#!/usr/bin/env python3
"""
MejoresCampings - Entrypoint Scraper Script
Delegates execution to scrape_andalucia.py
"""
import sys
import scrape_andalucia

def main():
    scrape_andalucia.main(sys.argv[1:])

if __name__ == "__main__":
    main()
